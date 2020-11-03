(function($) {
    "use strict"
    // <option value="volvo">Volvo</option>

    var vidElementForTarget = function(target) {
        return target.replace(" ", "_").replace(".", ".");
    }

    var vidBaselineElementForTarget = function(target) {
        return target.replace(" ", "_").replace(".", "") + "Baseline";
    }

    var vidTitleElementForTarget = function(target) {
        return target.replace(" ", "_").replace(".", "") + "Title";
    }

    // Load all the transfers
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    };
    var transfers_to_videos = function(target, src, typ='duck.webm') {
        target = target.replaceAll(" ", "_").replaceAll(".", "")
        src = src.replaceAll(".", "").replaceAll(" ", "_")
        // console.log(src + "/" + target)
        return target + "/" + src + "/" + typ;
    };
    var valid_targets = []


    // Create empty rows: 1 for each target
    var createVideoPlaceholders = function() {
        $("#video-section").empty();
        for (var i in valid_targets) {
            var target = valid_targets[i];

            var newRowTitle = document.createElement('div');
            newRowTitle.className = 'row';
            newRowTitle.id = vidTitleElementForTarget(target);
            document.getElementById("video-section").appendChild(newRowTitle);
            
            var newRowBaseline = document.createElement('div');
            newRowBaseline.className = 'row horiz-scroll';
            newRowBaseline.id = vidBaselineElementForTarget(target);
            document.getElementById("video-section").appendChild(newRowBaseline);

            var newRow = document.createElement('div');
            newRow.className = 'row horiz-scroll';
            newRow.id = vidElementForTarget(target);
            document.getElementById("video-section").appendChild(newRow);
            
        }
    }
    

    var transferToTitleElement = { };

    var getTransferTitleElement = function(transferName, counts) {
        var order = transferName.split(" + ").length;
        if (order < 2) {
            return transferName;
        }
        else {
            // console.log(transferName.replaceAll("/", " - "));
            var orderName = order.toString();
            if (order == 2) {
                orderName += "nd";
            }
            else if (order == 3) {
                orderName += "rd";
            }
            else {
                orderName += "th";
            }
            
            if (!(orderName in counts)) {
                counts[orderName] = 0;
            }
            counts[orderName] += 1;

            var counter = ""
            if (order < 5) { // only one transfer 5th order and above
                counter = "(#" + counts[orderName] + ") "
            }
            
            return orderName + " Order  " + counter + 
            `<i 
                class="fa fa-info-circle"
                style="float:right"
                data-toggle="tooltip"
                data-trigger="focus"
                data-container=""
                data-placement="auto right" 
                data-original-title="
                    <div style='font-family: Poppins, sans-serif'>` +
                    transferName.split(" + ").join("<br>") +
                    `</div>"
            >
            </i>`;
        }
    }

    // var addSources = function() {
    //     var selected_target = $("#targetpicker").val();
    //     transfers_to_videos[selected_target]['ImageNet'] = {'ours': transfers_to_videos[selected_target]['Task-Specific']['alex']};
    //     transfers_to_videos[selected_target]['No Transfer'] = {'ours': transfers_to_videos[selected_target]['Task-Specific']['scratch']};
    //     // transfers_to_videos[selected_target]['Task-Specific']['scratch']);
        
    //     var sources_to_vids = transfers_to_videos[selected_target]
    //     var sources = Array.from(Object.keys(sources_to_vids));
    //     sources.sort(function(a, b){ // Single-source first
    //         var a_srcs = a.split("/")
    //         var b_srcs = b.split("/")
    //         if (a_srcs.length == b_srcs.length) {
    //             return a >= b ? 1 : -1
    //         }
    //         return a_srcs.length - b_srcs.length
    //     });
    //     var innerHTML = "";
    //     for (var i in sources) {
    //         var key = sources[i];
    //         innerHTML = innerHTML + '<option value="' + key + '">' + key.replace(/\//g, " + ") + 
    //         '' +
    //         '</option>\n';
            
    //     }
    //     $("#sourcepicker").html(innerHTML);
    //     $("#sourcepicker").selectpicker('refresh');


    //     var counts = {};
    //     $('[data-id="sourcepicker"]').parent().children('[role="combobox"]').find(".text").each( function () {
    //         transferToTitleElement[this.innerHTML] = getTransferTitleElement(this.innerHTML, counts);
    //         this.innerHTML = transferToTitleElement[this.innerHTML];
    //     });
    //     $("#sourcepicker").selectpicker('val', 'Curvature');

    //     // console.log("Updating " + selected_target);
    //     $('[data-id="sourcepicker"]').parent().addClass('sourcepickerclass');
    //     // $('[data-id="sourcepicker"]').parent().children('[role="combobox"]').addClass('sourcepickerclass');



    // };


    var source_exists = [];
    var all_videos = [];

    $('#clearDemo').on("click", function() {
        document.getElementById("video-section").innerHTML = "";        
        // document.getElementById("our-vids").innerHTML = "";
        // document.getElementById("alex-vids").innerHTML = "";
        // document.getElementById("scratch-vids").innerHTML = "";
        all_videos = [];
        source_exists = [];
        createVideoPlaceholders();
    });


    var makeVideoFrame = function(title, vid_name, half=false) {
        var folderName = "video_short";
        // title = title.includes("To:") ? title : '← ' + transferToTitleElement[title];
        var videoHolder = document.createElement("div");

        if (half == true) {
            videoHolder.classList.add('col-xs-9');
        } else {
            videoHolder.classList.add('col-xs-6');
        }    
        videoHolder.classList.add('no-pad');
        videoHolder.classList.add('scrollable');

        if (vid_name.includes('self__')){
            vid_name = vid_name.replace('self__', '').replace('__8__unlocked', '');
        }
        var titleElem = document.createElement("div");
        titleElem.innerHTML = "<p class='vidtitle'>" + title + "</p>";

        var cls = "hi";
        var vid = document.createElement("div");
        vid.classList.add("vidcontainer");
        var width = 'width=100%';
        if (half == true) {
            width = 'width=100%';
        }
        vid.innerHTML = '<video muted playsinline preload="metadata" ' + width + 
            ' height=100%' + 
            ' style="background-color:#ddd" class=' + cls + 
            ' loop >' +
            '<source src="/videos/' + vid_name + '" type="video/webm">' +
            '<source src="/videos/' + vid_name.replace('webm', 'mp4') + '" type="video/mp4">' +
            'Video not found.</video>';

        if (half == true) {
            vid.innerHTML += "<div class=vidtitle-bg><div class='vidtitle-left vidtitle-small'>Agent's Observation</div><div class='vidtitle-center vidtitle-small'>Raw Sensory Observation</div><div class='vidtitle-right vidtitle-small'>Novel Test Space Map</div></div>"
        } else {
            vid.innerHTML += "<div class=vidtitle-bg><div class='vidtitle-left'>Agent's Observation</div><div class='vidtitle-right'>Novel Test Space Map</div></div>"
        }
        videoHolder.appendChild(titleElem);
        videoHolder.appendChild(vid);
        return [videoHolder, vid];
    }


    var makeRowTitle = function(title) {
        var folderName = title == "Source" ? 'video_short' : 'video_short';
        var videoHolder = document.createElement("div");
        videoHolder.classList.add('col-xs-12');
        // videoHolder.classList.add('no-pad');

        var bb = videoHolder.getBoundingClientRect();
        var width = bb.right - bb.left;


        // var titleElem = document.createElement("div");
        // videoHolder.innerHTML = "<h4 style='float:right; transform: translateX(-100%) rotate(-90deg) ;'>" + title + "</h4>";
        videoHolder.innerHTML = "<h3 style='text-align:center;    text-decoration: underline; '>" + title + "</h4>";

        // videoHolder.appendChild(titleElem);
        return videoHolder;
    }


    var replaceSourcpickerTitle = function() {
        var selected_source = $(".sourcepickerclass .filter-option");
        var amended_html = transferToTitleElement[selected_source.html()]
        selected_source.html(amended_html);
    }

    var syncAllVideos = function(all_videos){
        var d = new Date();
        var start_time =  d.getTime()
        var timeout_length = 10000; // in millis
        var is_vid_load_timeout = function(vids) {
            return (d.getTime() - start_time > timeout_length)
        }

        var is_all_loaded = function(vids) {
            var n_loaded = 0;
            vids.forEach( function(vid) {
                vid = vid.children[0];
                // console.log(vid.readyState);
                if(vid.readyState === 4 || vid.readyState === 1) {
                    n_loaded += 1;
                }
            });
            // console.log(n_loaded, vids.length)
            return (n_loaded == vids.length);
        };

        var play_all = function(vids) {
            vids.forEach( function(vid) {
                vid = vid.children[0];
                vid.playbackRate = 0.65;
                vid.play();
            });
        };                    


        // Pause all videos until loaded
        all_videos.forEach( function(vid) {
            vid = vid.children[0];
            vid.pause();
            vid.currentTime = 0;
            vid.onloadeddata = function() {
                // if(is_vid_load_timeout(all_videos)) {
                if(is_all_loaded(all_videos) && !is_vid_load_timeout(all_videos)) {
                    play_all(all_videos);
                }
                else {
                    // vid.pause();
                }
            };
        });

        setTimeout(function() { play_all(all_videos); }, timeout_length);
    }


    $('#submitDemo').on("click",function() {
        var selected_target = $("#targetpicker").val();
        var selected_source = $("#sourcepicker").val();
        
        var vid_name = transfers_to_videos(selected_target, selected_source, 'first_person.webm')
        // console.log(vid_name)
        // Now add all the videos to the video sidebar on the right, one row at a time
        // vid_name = videos[node];
        // if (vid_name == undefined || vid_name['ours'].includes("NONE")) { // Some nodes do not have videos
        //     return;
        // }

        // Add video of first-person viewpoints 
        // var title = selected_source.replace(/\//g, " + ");
        // var ours = makeVideoFrame(title, transfers_to_videos(selected_target, selected_source, 'first_person.webm'));
        // document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        // all_videos.push(ours[1]);

        // Add video of feature readouts
        // var title = selected_source.replace(/\//g, " + ") + " (Features)";
        // var ours = makeVideoFrame(title, transfers_to_videos(selected_target, selected_source, 'first_person.webm'));
        // document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        // all_videos.push(ours[1]);

        // Add video of feature trajectories 
        // var title = selected_source.replace(/\//g, " + ") + " (Trajectories)";
        // var ours = makeVideoFrame(title, transfers_to_videos(selected_target, selected_source, 'duck.webm'));
        // document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        // all_videos.push(ours[1]);

        // Add video of first-person viewpoints 
        var title = selected_source.replace(/\//g, " + ");
        var ours = makeVideoFrame(title, transfers_to_videos(selected_target, selected_source, 'gibson_first_person_combined.webm'), true);
        document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        all_videos.push(ours[1]);
    
        // // Add video of first-person viewpoints 
        // var title = selected_source.replace(/\//g, " + ");
        // var ours = makeVideoFrame(title + " obs", transfers_to_videos(selected_target, selected_source, 'gibson_first_person_cropped.webm'), true);
        // document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        // all_videos.push(ours[1]);

        // var title = selected_source.replace(/\//g, " + ");
        // var ours = makeVideoFrame(title + " features", transfers_to_videos(selected_target, selected_source, 'gibson_first_person_features.webm'), true);
        // document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        // all_videos.push(ours[1]);

    
        // var title = selected_source.replace(/\//g, " + ") + " (Trajectories)";
        // var ours = makeVideoFrame(title, vid_name);
        // document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        // all_videos.push(ours[1]);

        var cls = 'wait-to-start';
        if(!source_exists.includes(selected_target)) {
            var titleElem = makeRowTitle(selected_target);
            document.getElementById(vidTitleElementForTarget(selected_target)).appendChild(titleElem);

            // document.getElementById(vidElementForTarget(selected_target)).appendChild(makeRowTitle(selected_target));
            var source = [];
            // source = makeVideoFrame("Input video", "og_4.webm");
            // document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            // all_videos.push(source[1]);
            source_exists.push(selected_target);

            // Add the three baselines
            // Scratch
            source = makeVideoFrame('<b>Scratch</b>', transfers_to_videos(selected_target, 'Scratch', 'gibson_first_person.webm'));
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Blind
            source = makeVideoFrame("<b>Blind</b>",  transfers_to_videos(selected_target, 'Blind', 'gibson_first_person.webm'));
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // // Random
            // source = makeVideoFrame("Random Features",  transfers_to_videos(selected_target, 'Random', 'gibson_first_person.webm'));
            // document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            // all_videos.push(source[1]);
            
            // // Pixels-as-state
            // source = makeVideoFrame("Blind  (Trajectories)",  transfers_to_videos(selected_target, 'Blind'));
            // document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            // all_videos.push(source[1]);

            // No Transfer
            // source = makeVideoFrame('No Transfer (16k data)', transfers_to_videos[selected_target]['Task-Specific']['scratch']);
            // document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            // all_videos.push(source[1]);

            document.getElementById(vidElementForTarget(selected_target)).style = "margin-bottom:105px";
        }
        // var title = "From: " + transferToTitleElement[selected_source.replace(/\//g, " + ")];
        syncAllVideos(all_videos);
        // all_videos = all_videos.concat([source, ours]);
    });     
    
    
    $(document).ready(function () {
        $("body").tooltip({   
            trigger: "hover",
            selector: "[data-toggle='tooltip']",
            container: "body",
            html: true

        })
    });


    // $.get('../assets/transfers_to_videos.json', function(data) {
    //     transfers_to_videos = data;
    //     var transfers_targets = Array.from(Object.keys(transfers_to_videos));
    //     transfers_targets.sort();
        
    //     // List target transfers
    //     // var innerHTML = "";
    //     for (var i in transfers_targets) {
    //         var key = transfers_targets[i];
    //         if (transfers_to_videos[key]['Task-Specific']['ours'] == "NONE") { // These can't be vized
    //             continue;
    //         }
    //         valid_targets.push(key);
    //         // innerHTML = innerHTML + '<option value="' + key + '">' + key + '</option>\n';
    //     }
    //     createVideoPlaceholders();

    //     // document.getElementById("targetpicker").innerHTML = innerHTML;
    //     // console.log(innerHTML);
    //     $(document).ready(function () {
    //         $(document).ready(function () {
    //             $('#targetpicker').selectpicker('val', 'Normals');
    //             addSources();
    //             document.getElementById("targetpicker").addEventListener("change", addSources, false);    
    //             document.getElementById("sourcepicker").addEventListener("change", replaceSourcpickerTitle, false);    
    //             // $('#targetpicker').selectpicker('refresh');
    //         });
    //     });
    
    // });

    // List target transfers
    // var innerHTML = "";
    // for (var i in transfers_targets) {
    //     var key = transfers_targets[i];
    //     valid_targets.push(key);
    //     // innerHTML = innerHTML + '<option value="' + key + '">' + key + '</option>\n';
    // }
    valid_targets = ['Local Planning', 'Navigation', 'Exploration']
    createVideoPlaceholders();
})(jQuery);